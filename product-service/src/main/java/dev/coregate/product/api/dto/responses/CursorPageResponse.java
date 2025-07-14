package dev.coregate.product.api.dto.responses;

import java.util.List;

import lombok.Data;

@Data
public class CursorPageResponse<T> {
  private List<T> items;
  private String nextCursor;
  private boolean hasMore;
  private int size;

  public CursorPageResponse() {
  }

  public CursorPageResponse(List<T> items, String nextCursor, boolean hasMore, int size) {
    this.items = items;
    this.nextCursor = nextCursor;
    this.hasMore = hasMore;
    this.size = size;
  }
}
